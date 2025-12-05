// simple domain types
export type Choice = {
  id: string;
  text: string;
  targetId: string | null; // id of the node this choice leads to
};

export type StoryNode = {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
};
