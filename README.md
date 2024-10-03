![PTE-Core Diagram](./PTE.drawio.png)


PTE-Core English Test Preparation Platform
This platform is designed to help candidates practice for the PTE-Core English Test. It allows users to practice various tasks for the exam and view correct answers to improve their performance. All API routes are protected with token-based authentication, ensuring a secure experience. The platform connects to MongoDB to retrieve questions and answers, providing a structured practice environment.

Features
Practice Modules: Users can practice tasks such as speaking, writing, and reading.
Correct Answers: After completing a task, users can view correct answers for self-assessment.
User Authentication: Users must log in to access practice modules, and all API routes are protected by token-based authentication.
Progress Tracking: MongoDB is used to store user progress, allowing users to track their activities and completed tasks.

Future Features
AI-Powered Feedback (Planned): Future updates will introduce real-time AI-based feedback and scoring for speaking and writing tasks.
Performance Reports (Planned): Detailed reports will analyze user performance, offering personalized recommendations.
Mobile Support: Expand the platform to mobile devices using React Native.

Technologies Used
Frontend: React
Backend: Node.js with Express
Database: MongoDB (for tracking user progress and storing questions/answers)
Authentication: Token-based authentication for protected API routes

How It Works
Authentication
Users must log in to access the practice modules.
All API routes are protected using JWT tokens, ensuring secure access to user data and tasks.

API Routes
The backend is responsible for handling API requests, retrieving questions and answers from MongoDB, and protecting routes through authentication.

-Login/Signup API: Users must log in or sign up to receive a token.
-Protected Routes: All routes (e.g., retrieving questions or submitting tasks) require a valid token.

Current Functionality:
User Login: Users authenticate using their login credentials to receive a JWT token.
Token-based Authentication: All API routes are protected by this token, ensuring only authorized users can access them.
Question Retrieval: The backend fetches questions and answers from MongoDB and returns them to the frontend for practice.
View Correct Answers: After completing a task, users can see the correct answers.

Planned Features
AI-Powered Feedback: Implement AI for real-time scoring and feedback on speaking and writing tasks.
User Performance Reports: Future updates will provide insight into user performance and areas for improvement.
Mobile Version: Expand the platform to mobile devices with React Native for better accessibility.

Contributing
We welcome contributions to improve the platform! Please follow these steps:

Fork the repository.
Create a new branch: git checkout -b feature/your-feature.
Commit your changes: git commit -m 'Add some feature'.
Push the branch: git push origin feature/your-feature.
Submit a pull request.