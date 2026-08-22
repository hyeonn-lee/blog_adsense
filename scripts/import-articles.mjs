import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "article", "meeeeeowcat-1-1");
const POSTS_DIR = path.join(ROOT, "posts");
const IMAGES_DIR = path.join(ROOT, "public", "images", "posts");

// folder id -> { slug, category }. Only folders listed here get imported.
const MAP = {
  17: { slug: "senior-health-checkup-essentials", category: "health" },
  20: { slug: "dementia-prevention-habits-40s", category: "health" },
  23: { slug: "mind-diet-dementia-prevention", category: "health" },
  24: { slug: "dementia-prevention-exercise-30min", category: "health" },
  25: { slug: "dementia-early-symptoms-checklist", category: "health" },
  26: { slug: "mild-cognitive-impairment-symptoms", category: "health" },
  45: { slug: "health-checkup-extra-items-50s-60s", category: "health" },
  46: { slug: "blood-pressure-medication-myths", category: "health" },
  47: { slug: "lower-cholesterol-naturally", category: "health" },
  48: { slug: "coq10-benefits-side-effects", category: "health" },
  50: { slug: "senior-diet-trends-2026", category: "health" },
  51: { slug: "repeated-questions-dementia-signs", category: "health" },

  32: { slug: "basic-pension-application-guide-2026", category: "policy" },
  33: { slug: "senior-job-program-2026", category: "policy" },
  34: { slug: "subway-free-ride-age-policy", category: "policy" },
  35: { slug: "long-term-care-limit-increase-2026", category: "policy" },
  38: { slug: "capital-gains-tax-relief-relocation-65", category: "policy" },
  39: { slug: "integrated-care-support-act", category: "policy" },

  28: { slug: "stock-dividend-guide", category: "life" },
  29: { slug: "stop-loss-investing-tips", category: "life" },
  41: { slug: "dementia-insurance-vs-care-insurance", category: "life" },
  42: { slug: "senior-health-insurance-rejection-65", category: "life" },
  43: { slug: "pre-existing-condition-insurance-guide", category: "life" },
  44: { slug: "leveraged-etf-deposit-regulation-2026", category: "life" },
  52: { slug: "habits-of-lucky-people-50s", category: "life" },
  53: { slug: "aging-gracefully-habits", category: "life" },
};

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});
turndown.use(gfm);

// 본문 구조 특성상 h1~h6을 모두 "섹션 제목(##)" 한 단계로 통일 (TOC/광고 삽입 로직이 ## 기준)
["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
  turndown.addRule(tag, {
    filter: tag,
    replacement: (content) => `\n\n## ${content.trim()}\n\n`,
  });
});

function findHtmlFile(folder) {
  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".html"));
  return files.length > 0 ? path.join(folder, files[0]) : null;
}

function toYmd(dateStr) {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(dateStr || "");
  return m ? m[1] : "2026-01-01";
}

/** 표 바로 앞의 뭉개진 헤더 텍스트("가구 유형2025년2026년인상액")를 열 개수에 맞게 분리 시도 */
function guessHeaderCells(text, colCount) {
  const parts = text.split(/(?=\d{4}년|인상액|내용|차이|비고|구분|기준)/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === colCount) return parts;
  return null;
}

function promoteTableHeader($, table) {
  const $table = $(table);
  if ($table.find("thead").length > 0) return;
  const rows = $table.find("tr");
  if (rows.length === 0) return;
  const colCount = rows.first().find("td,th").length;

  let headerText = "";
  let unwrapParentDiv = false;
  const parent = $table.parent();
  // 표를 바로 감싸는 "작은" div만 대상으로 함 (본문 전체 컨테이너(.contents_style)는 절대 건드리지 않음)
  const parentIsSmallWrapperDiv =
    parent.length > 0 &&
    (parent.prop("tagName") || "").toUpperCase() === "DIV" &&
    !parent.hasClass("contents_style") &&
    parent.children().length <= 3;

  // case A: 표를 감싸는 div 안에 뭉개진 헤더 텍스트가 함께 들어있는 경우
  if (parentIsSmallWrapperDiv) {
    const directText = parent
      .contents()
      .filter(function () {
        return this.type === "text";
      })
      .text()
      .trim();
    if (directText) {
      headerText = directText;
      unwrapParentDiv = true;
    }
  }

  // case B: 표 바로 앞 형제가 헤딩/문단인 경우
  let prevToRemove = null;
  if (!headerText) {
    const prev = $table.prev();
    if (prev.length && /^(h[1-6]|p)$/i.test(prev.prop("tagName") || "")) {
      const t = prev.text().trim();
      if (t) {
        headerText = t;
        prevToRemove = prev;
      }
    }
  }

  const guessed = headerText ? guessHeaderCells(headerText, colCount) : null;
  const thead = $("<thead>").append(
    $("<tr>").append(
      (guessed ?? Array.from({ length: colCount }, () => "")).map((t) => `<th>${t}</th>`).join("")
    )
  );
  $table.prepend(thead);

  if (prevToRemove) prevToRemove.remove();
  if (unwrapParentDiv) parent.replaceWith($table);
}

/** 원문 하단의 구버전 블로그(tistory.com) 링크 목록, 태그 중복 표기 등 불필요한 블록 제거 */
function stripBoilerplate($, content) {
  // 회색 span 안의 "태그: ..." / "#태그 #태그" 줄
  content.find("p").each((_, p) => {
    const $p = $(p);
    if ($p.find('span[style*="dddddd"]').length > 0) $p.remove();
  });

  // "함께 보면 좋은 글" 같은 라벨 + tistory.com 링크만 있는 목록
  content.find("ul, ol").each((_, list) => {
    const $list = $(list);
    const links = $list.find("a");
    if (links.length === 0) return;
    const allOldBlog = links.toArray().every((a) => ($(a).attr("href") || "").includes("tistory.com"));
    if (allOldBlog) {
      const prev = $list.prev();
      if (prev.length && prev.text().trim().length < 30) prev.remove();
      $list.remove();
    }
  });

  // 장식용 구분선
  content.find("hr").remove();

  // 빈 앵커
  content.find("a[id]").each((_, a) => {
    const $a = $(a);
    if (!$a.text().trim()) $a.remove();
  });
}

function importOne(folderName) {
  const conf = MAP[folderName];
  if (!conf) return null;

  const folder = path.join(SRC_DIR, String(folderName));
  const htmlPath = findHtmlFile(folder);
  if (!htmlPath) {
    console.warn(`[skip] ${folderName}: html not found`);
    return null;
  }

  const raw = fs.readFileSync(htmlPath, "utf8");
  const $ = cheerio.load(raw);

  const title = $(".title-article").first().text().trim();
  const date = toYmd($(".date").first().text().trim());
  const tags = $(".tags")
    .first()
    .text()
    .split(/\s+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean);

  const content = $(".contents_style").first();

  // 1) "목차" 라벨 바로 다음 목록을 정확히 찾아 항목 텍스트 수집 (요약(3줄 요약) 목록과 혼동 방지)
  const tocTexts = new Set();
  content.find("p, h1, h2, h3, h4, h5, h6").each((_, el) => {
    if ($(el).text().trim() === "목차") {
      const list = $(el).next();
      if (list.is("ol,ul")) {
        list.find("li").each((_, li) => tocTexts.add($(li).text().trim()));
      }
    }
  });

  // 2) 목차와 동일한 텍스트를 가진 굵은 글씨 단락을 섹션 제목(h3)으로 승격
  content.find("p").each((_, p) => {
    const $p = $(p);
    const text = $p.text().trim();
    if (tocTexts.has(text) && !$p.find("img").length) {
      $p.replaceWith(`<h3>${text}</h3>`);
    }
  });

  // 3) "목차" 라벨 + 목록 블록 자체는 제거 (상세페이지에서 자체 TOC를 별도로 렌더링하므로 중복)
  content.find("p, h1, h2, h3, h4, h5, h6").each((_, el) => {
    const $el = $(el);
    if ($el.text().trim() === "목차") {
      const list = $el.next();
      if (list.is("ol,ul")) list.remove();
      $el.remove();
    }
  });

  // 4) 제목을 그대로 반복하는 첫 굵은 글씨 단락 제거
  const firstP = content.find("p").first();
  if (firstP.length && firstP.text().trim() === title) {
    firstP.remove();
  }

  // 5) 대표 이미지(첫 이미지) 분리 — 상세페이지 상단에서 별도로 노출되므로 본문에서는 제거
  let heroImage = null;
  const firstImg = content.find("img").first();
  if (firstImg.length) {
    const src = firstImg.attr("src") || "";
    if (/^https?:\/\//i.test(src)) {
      heroImage = src; // 외부 CDN 이미지는 그대로 사용
    } else {
      const localPath = path.join(folder, "img", path.basename(src));
      if (fs.existsSync(localPath)) {
        heroImage = `/images/posts/${conf.slug}/${path.basename(src)}`;
      }
    }
    firstImg.closest("figure, p").remove();
  }

  // 6) 표 헤더 보정
  content.find("table").each((_, table) => promoteTableHeader($, table));

  // 7) 구버전 블로그 관련 글 링크, 태그 중복 표기, 구분선, 빈 앵커 제거
  stripBoilerplate($, content);

  // 8) 남은 이미지 경로를 실제 배포 경로로 치환 (로컬 파일이 실제로 없으면 깨진 이미지 대신 제거)
  content.find("img").each((_, img) => {
    const $img = $(img);
    const src = $img.attr("src") || "";
    if (/^https?:\/\//i.test(src)) return; // 외부 CDN 이미지는 그대로 둠
    const filename = path.basename(src);
    const localPath = path.join(folder, "img", filename);
    if (fs.existsSync(localPath)) {
      $img.attr("src", `/images/posts/${conf.slug}/${filename}`);
    } else {
      $img.closest("figure, p").remove();
    }
  });

  const bodyHtml = content.html() || "";
  let markdown = turndown.turndown(bodyHtml);

  // 원문에 깨져서 들어간 이모지 자리(물음표) 정리: "> **? 텍스트" / "## ? 텍스트" 형태
  markdown = markdown.replace(/(^|\n)(\s*(?:>\s*)?(?:#{1,6}\s*)?(?:\*\*)?)\?\s+/g, "$1$2");

  markdown = markdown.replace(/\n{3,}/g, "\n\n").replace(/\*\*참고 자료:?\*\*/g, "**참고 자료**");
  markdown = markdown.replace(/\*\*Sources:?\*\*/gi, "**참고 자료**");
  markdown = markdown.trim();

  // description: 목차/요약 이후 첫 실질 문단
  let description = "";
  content.find("p").each((_, p) => {
    if (description) return;
    const text = $(p).text().replace(/\s+/g, " ").trim();
    if (text.length > 20 && text !== title) {
      description = text.length > 120 ? text.slice(0, 120) + "…" : text;
    }
  });
  if (!description) description = title;

  // 이미지 복사
  const srcImgDir = path.join(folder, "img");
  if (fs.existsSync(srcImgDir)) {
    const destDir = path.join(IMAGES_DIR, conf.slug);
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcImgDir)) {
      fs.copyFileSync(path.join(srcImgDir, file), path.join(destDir, file));
    }
  }

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: "${date}"`,
    `description: ${JSON.stringify(description)}`,
    `category: "${conf.category}"`,
    `tags: ${JSON.stringify(tags)}`,
    ...(heroImage ? [`image: "${heroImage}"`] : []),
    "draft: false",
    "---",
    "",
    markdown,
    "",
  ].join("\n");

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(POSTS_DIR, `${conf.slug}.md`), frontmatter, "utf8");

  return { folderName, slug: conf.slug, title };
}

const results = [];
for (const key of Object.keys(MAP)) {
  const r = importOne(Number(key));
  if (r) results.push(r);
}

console.log(`Imported ${results.length} posts:`);
for (const r of results) console.log(`  ${r.folderName} -> posts/${r.slug}.md (${r.title})`);
