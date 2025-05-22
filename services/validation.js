function nameRegex(name) {
    return /^[A-Za-z\s]+$/.test(name);
    }

    function emailRegex(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    function passwordRegex(password) {
    return /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/.test(password);
    }

    export { nameRegex, emailRegex, passwordRegex };