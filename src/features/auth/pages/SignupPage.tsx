import { api } from "@/lib/axios";
import SignupForm, { type SignupSchemaType } from "../components/Signup";
import { useNavigate } from "react-router";

export default function Signup() {
  const navigate = useNavigate();
  async function handleSubmit(data: SignupSchemaType): Promise<void> {
    try {
      console.log("data fromt the ", data);
      // send the request to the backend
      const res = await api.post("/signup", data);
      
      // redirect the use to the login page
      navigate("/auth/login", { replace: true });
    } catch (error) {
      throw error;
    }
  }
  return (
    <main className="flex-1 flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join our professional mentorship community.
          </p>
        </div>

        <SignupForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
