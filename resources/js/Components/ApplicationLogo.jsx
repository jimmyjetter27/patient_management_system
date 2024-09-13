export default function ApplicationLogo(props) {
    return (
        <img src="/assets/img/logo.jpeg"  alt={import.meta.env.VITE_APP_NAME}
             className="w-20 h-18 rounded-lg"
        ></img>
    );
}
