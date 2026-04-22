export type ProfileMe = {
  _id?: string;
  username?: string;
  fullName?: string;
  avatar?: string;
};

export type ProfileMeResponse = {
  status: 'success';
  data: ProfileMe | null;
};

export type ProfilePublic = {
  _id?: string;
  username?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  skills?: string[];
  created_at?: string;
};

export type ProfilePublicResponse = {
  status: 'success';
  data: ProfilePublic | null;
};

export type ProfileSetting = {
  username?: string;
  email?: string;
  phone?: string;
  is_verified?: boolean;
};

export type ProfileSettingResponse = {
  status: 'success';
  data: ProfileSetting | null;
};
