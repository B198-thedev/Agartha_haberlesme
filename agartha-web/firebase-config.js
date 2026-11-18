// Firebase Console -> Proje Ayarları -> Uygulamalarınız -> Web (</>) bölümünden
// aldığınız config bilgilerini buraya yapıştırın.

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDbh4iwdQo_HV1ea1wJ5ohwpLKXuS-FaGY",
  authDomain: "agartha-haber.firebaseapp.com",
  databaseURL: "https://agartha-haber-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "agartha-haber",
  storageBucket: "agartha-haber.firebasestorage.app",
  messagingSenderId: "908287992500",
  appId: "1:908287992500:web:cf925fc47c206e5128ade1",
  measurementId: "G-K64CRC40RL"
};

// Admin şifresi güvenlik için artık kodun içinde tutulmuyor.
// İlk kez giriş yaparken yazdığınız Erişim Kodu, SHA-256 ile özetlenerek
// doğrudan Firebase veritabanına Admin şifresi olarak kaydedilir.
