import { Appbar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"

export const Blogs = () => {
    return (
        <div>
            <Appbar />
            <BlogCard 
                authorName="John Doe"
                title="Understanding React Hooks"
                content="React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become a fundamental part of React development. Hooks allow you to manage state, side effects, context, and more in functional components, making your code cleaner and more reusable."
                publishedDate="2023-10-01"
                id={1}
            />
            
           
        </div>
    )
}