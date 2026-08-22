import fs from "fs";
import os from "os";
import path from "path";
import { simpleGit } from "simple-git";

const repoRoot = path.join(process.cwd());
const git = simpleGit(repoRoot);

const AUTO_GIT_SYNC = process.env.ADMIN_AUTO_GIT_SYNC !== "false";

export type GitSyncResult =
  | { synced: true }
  | { synced: false; reason: string };

/** posts/ 변경사항을 commit 후 push. 실패해도 로컬 저장 자체는 이미 완료된 상태입니다. */
export async function commitAndPushPosts(message: string): Promise<GitSyncResult> {
  if (!AUTO_GIT_SYNC) {
    return { synced: false, reason: "자동 동기화가 비활성화되어 있습니다 (ADMIN_AUTO_GIT_SYNC=false)." };
  }

  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return { synced: false, reason: "git 저장소가 초기화되어 있지 않습니다." };
    }

    await git.add(["posts"]);
    const status = await git.status();
    if (status.staged.length === 0) {
      return { synced: false, reason: "변경된 내용이 없습니다." };
    }

    // Windows에서 커밋 메시지를 커맨드라인 인자로 바로 넘기면 콘솔 코드페이지 때문에
    // 한글이 깨질 수 있어, 파일에 UTF-8로 써서 `-F` 옵션으로 전달합니다.
    const msgFile = path.join(os.tmpdir(), `commit-msg-${Date.now()}.txt`);
    fs.writeFileSync(msgFile, message, "utf8");
    try {
      await git.raw(["commit", "-F", msgFile]);
    } finally {
      fs.unlinkSync(msgFile);
    }

    const remotes = await git.getRemotes();
    if (remotes.length === 0) {
      return { synced: false, reason: "커밋은 완료됐지만 원격 저장소(remote)가 설정되어 있지 않아 push하지 못했습니다." };
    }

    const branchSummary = await git.branchLocal();
    const currentBranch = branchSummary.current || "main";
    await git.push("origin", currentBranch);

    return { synced: true };
  } catch (error) {
    return {
      synced: false,
      reason: error instanceof Error ? error.message : "알 수 없는 git 오류가 발생했습니다.",
    };
  }
}
