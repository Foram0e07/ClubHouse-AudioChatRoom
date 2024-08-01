/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PEOPLE_IMAGES } from "../../images";
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import { useNavigate } from "react-router-dom";

interface FormValues {
    username: string;
    name: string;
}

export const SignIn = () => {
    const cookies = new Cookies();
    const {setClient, setUser} = useUser();

    const navigate = useNavigate();

    const schema = yup.object().shape({
        username: yup.string().required("Username is Required").matches(/^[a-zA-Z0-9_.@$]+$/, "Invalid Username"),
        name: yup.string().required("Name is Required"),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const { username, name } = data;

        const response = await fetch("http://localhost:3001/auth/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                name,
                image: PEOPLE_IMAGES[Math.floor(Math.random() * PEOPLE_IMAGES.length)]
            }),
        });

        if (!response.ok) {
            alert("Some error occurred while signing in");
            return;
        }

        const responseData = await response.json();
        console.log(responseData);
        
        const user: User = {
            id: username,
            name
        }

        const myClient = new StreamVideoClient({
            apiKey: "zxgj5y794c32",
            user,
            token:responseData.token,
        });
        setClient(myClient);
        setUser({username, name});

        const expires = new Date()
        expires.setDate(expires.getDate()+1)
        cookies.set("token", responseData.token,{
            expires,
        });
        cookies.set("username", responseData.username,{
            expires,
        });
        cookies.set("name", responseData.name,{
            expires,
        });

        navigate("/");
    }; 

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: yupResolver(schema) });

    return (
        <div className="sign-in-container">
            <div className="glass-effect">
                <h1>Welcome to Audio Chats</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            {...register("username")}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                        {errors.username && <p className="error">{errors.username.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            {...register("name")}
                            placeholder="Enter your name"
                            autoComplete="name"
                        />
                        {errors.name && <p className="error">{errors.name.message}</p>}
                    </div>
                    <button type="submit" className="sign-in-button">Sign In</button>
                </form>
            </div>
        </div>
    );
};
