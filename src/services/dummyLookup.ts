import books from "@/data/dummyBooks.json";

export const DUMMY_BOOK_KEY = "tori_dummy_book";
export type DummyBook = (typeof books)[number];

export interface LookupRequest {
  name: string;
  age: number;
  topics: string[];
  motifs: string[];
  artStyle: string;
  customTopic?: string;
}

export function findDummyBook(req: LookupRequest): DummyBook | null {
  return books.find((book) => book.name === req.name.trim()) ?? null;
}

const THUMBNAIL_BY_TITLE: Record<string, string> = Object.fromEntries(
  books.map((b) => [b.title, `${__BASE_PATH__}books/${b.thumbnail}`])
);

export function getDummyThumbnail(title: string): string {
  return THUMBNAIL_BY_TITLE[title] ?? "";
}
