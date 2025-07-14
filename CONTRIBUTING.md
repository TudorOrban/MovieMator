# 🤝 Contributing to MovieMator

We love community contributions! MovieMator is an open-source project, and we welcome anyone who wants to help make it even better. Whether you're fixing a bug, adding a new feature, improving documentation, or just sharing an idea, your input is valuable.

Please take a moment to review this document to understand how to contribute effectively.

---

## 🚀 Getting Started

To get your local development environment set up, please refer to the **"Running Locally"** section in our main [README.md](https://github.com/TudorOrban/MovieMator/blob/main/LICENSE.md) file. It contains detailed instructions on setting up the database, backend, and frontend.

---

## 💡 How to Contribute

We follow a standard GitHub flow for contributions:

1.  **Fork the Repository**: Start by forking the `MovieMator` repository to your GitHub account.
2.  **Clone Your Fork**: Clone your forked repository to your local machine:
    ```bash
    git clone [https://github.com/TudorOrban/MovieMator.git](https://github.com/TudorOrban/MovieMator.git)
    cd MovieMator
    ```
3.  **Create a New Branch**:
    * **Important**: All development work should be done on a new branch created from the `dev` branch.
    * First, ensure your local `dev` branch is up-to-date with the upstream `dev` branch:
        ```bash
        git checkout dev
        git pull origin dev
        ```
    * Then, create your new branch:
        ```bash
        git checkout -b feature/your-feature-name # For new features
        # or
        git checkout -b bugfix/issue-description # For bug fixes
        ```
    * Give your branch a clear and descriptive name related to the changes you're making.
4.  **Make Your Changes**: Implement your features, bug fixes, or documentation updates.
5.  **Test Your Changes**: Before committing, ensure your changes work as expected and haven't introduced any regressions. Run local tests if available.
6.  **Commit Your Changes**:
    * Write clear and concise commit messages. A good commit message explains *what* changed and *why*.
    * ```bash
        git add .
        git commit -m "feat: Add user profile page"
        # or
        git commit -m "fix: Resolve issue with movie search filter"
        ```
7.  **Push Your Branch**: Push your changes to your forked repository on GitHub:
    ```bash
    git push origin your-branch-name
    ```
8.  **Open a Pull Request (PR)**:
    * Go to your forked repository on GitHub.
    * You'll see a prompt to create a new pull request from your recently pushed branch.
    * **Ensure the base branch for your pull request is `dev` in the `MovieMator` main repository.** Our CI/CD pipeline listens to changes on `main`, but all development happens on `dev`.
    * Provide a detailed description of your changes, including why they were made and any relevant issue numbers.
    * Submit your pull request.

---

## 📝 Code Practices

We aim for clean, readable, and maintainable code. While we will establish more specific coding guidelines in the future, please adhere to these general practices:

* **Consistency**: Follow the existing coding style within the project.
* **Clarity**: Write code that is easy to understand. Use meaningful variable and function names.
* **Modularity**: Break down complex problems into smaller, manageable functions or components.
* **Comments**: Add comments where the code's intent is not immediately obvious.
* **Error Handling**: Implement robust error handling where necessary.
* **Testing**: If you're adding a new feature or fixing a complex bug, consider adding or updating relevant tests.

---

## 🚨 Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/TudorOrban/MovieMator/blob/main/CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

---

## 🙏 Thank You!

We appreciate your interest in contributing to MovieMator! Your efforts help us build a better experience for everyone.