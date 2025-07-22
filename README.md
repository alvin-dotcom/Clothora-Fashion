# 👕 Clothora – AI-Powered Custom Clothing Design Platform

Clothora is a full-stack web application that allows users to design custom clothing using AI, personalize size preferences, and place orders—all through a seamless and modern interface. Whether you're creating a personalized T-shirt or customizing a designer shirt, Clothora offers AI-generated design options and a streamlined shopping experience.

---

## 🌐 Live Demo

🔗 [Visit Clothora](https://clothora.vercel.app/)


---

## 🖼️ Preview

<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/eadc0654-741d-49ac-bbb9-68c02e159803" />

---

## 📁 Project Structure

```

clothora/
├── client/       # Frontend (Next.js + Tailwind CSS)
├── server/       # Backend (Express.js + Node.js)
├── public/       # Public assets (APK, static images)
├── README.md     # Project documentation

````

---

## 🚀 Features

### 👤 User Experience
- Authentication (Login/Signup)
- Personalized dashboard

### 🎨 AI-Powered Design
- Design categories: Tees, Shirts, etc.
- Text prompt input for AI image generation
- Design results shown dynamically

### 📏 Customization
- Choose standard or custom size
- Wishlist to save favorite designs

### 📦 Order Workflow
- Address and billing entry
- Order confirmation and success page

### 📱 Responsive UI
- Fully mobile-friendly
- Clean UI with Tailwind CSS

---

## 🧠 Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- Cloudinary (for storing images)

### Database
- PostgreSQL

### AI
- Gemini API for design generation

---

## ⚙️ Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas / PostgreSQL setup
- API keys for AI and image storage

### Clone the Repository

```bash
git clone https://github.com/alvin-dotcom/clothora.git
cd clothora
````

### Setup Client

```bash
cd client
npm install
npm run dev
```

### Setup Server

```bash
cd server
npm install
npm start
```

---

## 🔐 Environment Variables

### server/.env

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_key
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

### client/.env

```env
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Future Enhancements

* ✅ Razorpay / Stripe payment integration
* ⏳ AR-based try-on previews
* ⏳ Email updates for orders
* ⏳ Stock and inventory management

---

## 🧑‍💻 Author

**Alvin Albert Michael**
📧 [gmail](mailto:michaelalvinalbert@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/alvin-albert-michael)
🔗 [Portfolio](https://alvinn.vercel.app)

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create a new branch
# Commit your changes
# Push and open a pull request
```

---

## 📜 License

Licensed under the **MIT License**.
See [`LICENSE`](./LICENSE) for details.


