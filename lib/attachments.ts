import attachmentsRaw from "@/data/attachments.json";

export type Attachment = {
  bf_no: number;
  bc_no: number;
  bd_no: number;
  real_name: string;
  save_name: string;
  actual_boards: string[];
};

const attachments = attachmentsRaw as Attachment[];

export function getAttachmentsFor(
  boardId: string,
  bdNo: number
): Attachment[] {
  return attachments.filter(
    (a) => a.bd_no === bdNo && a.actual_boards.includes(boardId)
  );
}

export function attachmentUrl(boardId: string, saveName: string): string {
  return `/upload/${boardId}/${saveName}`;
}
