export interface User {
  id: string;
  username: string;
  email: string;
}

export interface FileItem {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  createdAt: string;
  uploadedBy: string;
}

export interface UpdateFileData {
  originalName: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}