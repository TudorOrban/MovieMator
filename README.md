# MovieMator

---

## 🌟 Overview

MovieMator is your personal companion for tracking your cinematic journey. Easily record the films you've watched, rate them, and discover fascinating statistics about your movie watching habits and trends.

![Search-Movies](https://raw.githubusercontent.com/TudorOrban/MovieMator/main/screenshots/SearchMovies.png)
![Statistics](https://raw.githubusercontent.com/TudorOrban/MovieMator/main/screenshots/Statistics.png)

---

## ✨ Features

MovieMator helps you get the most out of your cinematic journey with these powerful features:

* **Effortless Tracking**: Easily log movies you've seen, complete with key details like **director**, **actors**, **genre**, and **runtime**.
* **Personalized Insights**: Assign your own **ratings** to each film and rediscover your favorites.
* **Smart Search & Discovery**: Find exactly what you're looking for with advanced **filters** for director, actors, genres, and more.
* **Visual Statistics**: Uncover fascinating **trends** in your movie-watching habits with our **Statistics** page, including distribution graphs, heatmap and more.

---

## 🚀 Getting Started

MovieMator is readily available online, or you can run it locally on your machine.

---

### 🌐 Live Application

Access the live MovieMator application at: **[moviemator.org](https://moviemator.org)**

---

### 💻 Running Locally

To run MovieMator on your local machine, follow these steps:

#### 📋 Prerequisites

You'll need the following installed:

* [**Java Development Kit (JDK) 21 or higher**](https://www.oracle.com/java/technologies/downloads/)
* [**Apache Maven**](https://maven.apache.org/download.cgi)
* [**Node.js (LTS version recommended)**](https://nodejs.org/en/download/)
* [**npm**](https://www.npmjs.com/get-npm) (comes with Node.js) or [**Yarn**](https://yarnpkg.com/getting-started/install)
* [**PostgreSQL**](https://www.postgresql.org/download/)

#### ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TudorOrban/MovieMator
    cd MovieMator
    ```
2.  **Set up PostgreSQL Database:**
    * Create a new PostgreSQL database named `moviemator_db`.
    * Ensure your PostgreSQL user has appropriate permissions to access this database.
3.  **Configure Backend:**
    * Navigate to the `backend` directory: `cd root/backend`
    * Set your PostgreSQL database password as an environment variable:
        ```bash
        export DB_PASSWORD="your_postgres_password"
        ```
        (Replace `"your_postgres_password"` with your actual PostgreSQL password.)
    * Run the Spring Boot application:
        ```bash
        mvn spring-boot:run
        ```
    * The backend will typically start on `http://localhost:8080`.
4.  **Configure Frontend:**
    * Open a **new terminal window** and navigate to the `frontend` directory: `cd root/frontend`
    * Install frontend dependencies:
        ```bash
        npm install
        # or
        yarn install
        ```
    * Run the Angular development server:
        ```bash
        ng serve
        ```
    * The frontend will now be accessible in the browser `http://localhost:4200`.

MovieMator should now be fully operational in your local environment.

---

## 🤝 Contributing

We warmly welcome any contributions. Check out [CONTRIBUTING](https://github.com/TudorOrban/MovieMator/blob/main/CONTRIBUTING.md) for more information.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/TudorOrban/MovieMator/blob/main/LICENSE.md) file for details.

---

## 📞 Contact

Have questions or suggestions? Feel free to open an issue on GitHub or reach out to tudororban2@gmail.com.