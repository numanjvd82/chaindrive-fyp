// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { axiosInstance } from "../lib/axios";

import MultiStepForm from "../components/pages/Signup";

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     role: "renter", // Default role
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.post("/api/auth/signup", form);
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         name="first_name"
//         placeholder="First Name"
//         onChange={handleChange}
//       />
//       <input name="last_name" placeholder="Last Name" onChange={handleChange} />
//       <input name="email" placeholder="Email" onChange={handleChange} />
//       <input
//         name="password"
//         placeholder="Password"
//         type="password"
//         onChange={handleChange}
//       />
//       <select name="role" onChange={handleChange}>
//         <option value="renter">Renter</option>
//         <option value="owner">Owner</option>
//       </select>
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// };

// export default SignUp;

const Signup = () => {
  return <MultiStepForm />;
};

export default Signup;
