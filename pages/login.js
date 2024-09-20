import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast"; // React Hot Toast import
import { auth } from "../firebase"; // Firebase.js'deki auth import

const tabVariants = {
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Kayıt için username

  const toggleTab = () => {
    setIsLogin((prev) => !prev);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  // Giriş Yapma Fonksiyonu
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success(`Hoş geldin, ${user.email}!`); // Başarı mesajı
    } catch (error) {
      toast.error(`Giriş yapılamadı: ${error.message}`); // Hata mesajı
    }
  };

  // Kayıt Olma Fonksiyonu
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success(`Kayıt başarılı, hoş geldin ${username}!`); // Başarı mesajı
    } catch (error) {
      toast.error(`Kayıt yapılamadı: ${error.message}`); // Hata mesajı
    }
  };

  return (
    <div className="flex h-screen text-white">
      <div className="flex flex-col justify-center items-center w-full h-full p-10">
        <div className="w-80 flex flex-col items-start">
          <AnimatePresence>
            {isLogin ? (
              <motion.div
                key="login"
                initial="exit"
                animate="enter"
                variants={tabVariants}
                transition={{ duration: 0.5 }} // Animasyon süresi 500 ms
                className="w-full max-w-md"
              >
                <h2 className="text-2xl mb-12">Giriş Yap</h2>
                <form
                  onSubmit={handleLogin} // Form onSubmit eventi
                  className="space-y-4 w-full flex flex-col items-start gap-3"
                >
                  <div className="w-full flex flex-col items-start gap-2">
                    <label className="block">E-Posta</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-2">
                    <label className="block">Şifre</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-purple-600 hover:bg-purple-500 rounded"
                  >
                    Giriş Yap
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial="exit"
                animate="enter"
                variants={tabVariants}
                transition={{ duration: 0.5 }} // Animasyon süresi 500 ms
                className="w-full max-w-md"
              >
                <h2 className="text-2xl mb-12 font-semibold">Kayıt Ol</h2>
                <form
                  onSubmit={handleRegister} // Form onSubmit eventi
                  className="space-y-4 flex flex-col items-start gap-3"
                >
                  <div className="w-full flex flex-col items-start gap-2">
                    <label className="block">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-2">
                    <label className="block">E-posta</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-2">
                    <label className="block">Şifre</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-purple-600 hover:bg-purple-500 rounded"
                  >
                    Kayıt Ol
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleTab}
            className="mt-5 text-left text-neutral-400 hover:text-neutral-200 transition-all"
          >
            {isLogin
              ? "Daha kayıt olmadın mı? Kayıt Ol."
              : "Zaten kayıtlı mısın? Giriş Yap."}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
