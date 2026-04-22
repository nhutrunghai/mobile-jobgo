export type ChatTurnRole = 'user' | 'assistant';

export type ChatTurn = {
  role: ChatTurnRole;
  content: string;
  created_at: string;
};

export type ChatSessionSummary = {
  session_id: string;
  title: string;
  last_message: string;
  last_intent?: string;
  created_at: string;
  updated_at: string;
};

export type ChatSessionDetail = ChatSessionSummary & {
  turns: ChatTurn[];
};

export type ChatSource =
  | {
      type: 'job';
      job_id: string;
      title: string;
      company: string;
    }
  | {
      type: 'resume';
      resume_id: string;
      title: string;
      chunk_index: number;
    };

export type ChatJobsResponse = {
  status: 'success';
  data: {
    session_id: string;
    intent: string;
    answer: string;
    sources: ChatSource[];
  };
};

export type ChatSessionsResponse = {
  status: 'success';
  data: {
    sessions: ChatSessionSummary[];
  };
};

export type ChatSessionDetailResponse = {
  status: 'success';
  data: ChatSessionDetail;
};
