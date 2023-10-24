<script setup>
import { ref } from "vue";
import axios from "axios";
import { vMaska } from "maska";

const email = ref("");
const number = ref("");
const result = ref([]);
const loader = ref(false);

const onSubmit = async () => {
  if (!validate(email.value, number.value)) {
    return;
  }
  loader.value = true;
  try {
    const response = await axios.post("/search", {
      email: email.value,
      number: number.value.replace(/-/g, ""),
    });
    result.value = response.data;
    if (response.data.length === 0) {
      result.value.push({ email: "User not found" });
    }
  } catch (error) {
    console.error(error);
    alert(error.message || "Request failed");
  }
  loader.value = false;
};

//Валидация
const emailError = ref("");
const phoneError = ref("");

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};
const validateNumber = (number) => {
  if (number === "") return true;
  const regex = /^[0-9]{2}-[0-9]{2}-[0-9]{2}$/;
  return regex.test(number);
};

const validate = (emailValue, numberValue) => {
  let isValid = true;

  if (!validateEmail(emailValue)) {
    emailValue ? emailError.value = "Invalid email" : emailError.value = "Email is required"
    isValid = false;
  } else {
    emailError.value = "";
  }

  if (!validateNumber(numberValue)) {
    phoneError.value = "Invalid number";
    isValid = false;
  } else {
    phoneError.value = "";
  }

  return isValid;
};
</script>

<template>
  <div>
    <main class="main">
      <form @submit.prevent="onSubmit">
        <input type="text" placeholder="Enter email" v-model="email" />
        <span v-if="emailError" class="error">{{ emailError }}</span>
        <input
          type="text"
          placeholder="Enter number"
          v-model="number"
          v-maska
          data-maska="##-##-##"
        />
        <span v-if="phoneError" class="error">{{ phoneError }}</span>
        <input type="submit" value="Test Server" />
      </form>
      <div v-if="result.length > 0 && !loader" class="result">
        <div class="user" v-for="(user, index) of result" :key="index">
          {{ user.email }} {{ user.number }}
        </div>
      </div>
      <div class="loader" v-if="loader"></div>
    </main>
  </div>
</template>

<style>
.main,
.main input {
  font-size: 1rem;
  line-height: 1.5rem;
  color: #353740;
  font-family: "ColfaxAI", Helvetica, sans-serif;
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main .icon {
  width: 2rem;
}
.main h3 {
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  color: #202123;
  margin: 1rem 0 2rem;
}
.main form {
  display: flex;
  flex-direction: column;
  width: 320px;
}
.main input[type="text"] {
  padding: 0.8rem 1rem;
  border: 1px solid #10a37f;
  border-radius: 0.2rem;
  margin-bottom: 1.5rem;
  outline-color: #10a37f;
}
.main ::placeholder {
  color: #8e8ea0;
  opacity: 1;
}
.main input[type="submit"] {
  padding: 12px 0;
  color: #fff;
  background-color: #10a37f;
  border: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.main .result {
  font-weight: bold;
  color: #10a37f;
  margin-top: 2rem;
}
.error {
  color: red;
  font-size: 0.8rem;
}
.loader {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="translate(20 50)"><circle cx="0" cy="0" r="6" fill="%234f7abe"><animateTransform attributeName="transform" type="scale" begin="-0.375s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="translate(40 50)"><circle cx="0" cy="0" r="6" fill="%230a7142"><animateTransform attributeName="transform" type="scale" begin="-0.25s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="translate(60 50)"><circle cx="0" cy="0" r="6" fill="%2313a365"><animateTransform attributeName="transform" type="scale" begin="-0.125s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="translate(80 50)"><circle cx="0" cy="0" r="6" fill="%234f7abe"><animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g></svg>');
  width: 200px;
  height: 200px;
}
</style>
