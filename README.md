Client Application Portal
A modern web application for managing client application processes, built with Next.js, Supabase, React, and TypeScript. This project is part of my developer portfolio, demonstrating my skills in building full-stack web apps with clean, responsive UIs and robust backend integration.

🚀 Overview
The Client Application Portal allows organizations to track client forms, monitor application progress, and update statuses in real time. It features a clean dashboard, CRUD operations, and integration with Supabase for database and authentication.

<!-- replace with actual screenshot or gif -->

🔗 Live Demo: https://client-application.netlify.app/



# 🛠 Tech Stack
Frontend: Next.js, React, TypeScript, CSS

Backend: Supabase (PostgreSQL, Auth, Realtime)

Tools & Libraries: Git, Node.js

Deployment: Netlify



## ✨ Key Features
🔐 User authentication and role-based access

📄 Create, edit, and update client applications (CRUD)

📊 Dashboard with summaries and progress indicators

⏱ Real-time updates via Supabase

📱 Fully responsive design



### ⚙️ Installation/Getting Started

# Clone the repository
git clone https://github.com/ensunny0619/client-application-portal.git
cd client-application-portal

# Install dependencies
npm install

# Run development server
npm run dev

```

App will be available at http://localhost:3000.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

```



#### 🖥 Usage
Sign up or log in to access the portal.

Create new applications via the New Application form.

Track application progress on the dashboard.

Update statuses (e.g., Pending → Complete) with real-time feedback.




##### 🧩 Challenges & Solutions
Challenge: Managing application state and filtering by status.

Solution: Implemented reusable utility functions (applicationStatus.ts) to compute completion percentages and summaries.

Challenge: Handling conditional form inputs and optional fields.

Solution: Used TypeScript interfaces with optional properties and dynamic form rendering.



######  Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a pull request.

