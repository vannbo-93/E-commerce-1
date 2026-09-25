/** @format */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../Api/baseURL";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean; // true فقط أثناء الفحص الأول عند تحميل التطبيق
  login: (user: AuthUser) => void; // تُستدعى من LoginPage بعد نجاح تسجيل الدخول
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // يسأل الخادم "من أنا؟" عبر الكوكي httpOnly تلقائيًا، دون قراءته يدويًا
    api
      .get("/user/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null)) // 401 يعني ببساطة: لا يوجد مستخدم مسجّل دخوله
      .finally(() => setLoading(false));
  }, []);

  const login = (loggedInUser: AuthUser) => setUser(loggedInUser);

  const logout = async () => {
    await api.post("/user/logout");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// hook مختصر بدل useContext(AuthContext) في كل مكان، مع فحص أنه يُستخدم داخل Provider فعليًا
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
