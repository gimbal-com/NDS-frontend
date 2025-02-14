import { Fragment, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Redirect = ({to}) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(to);
    }, [])
    return (
        <Fragment></Fragment>
    )
}

export default Redirect;