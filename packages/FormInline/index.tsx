import { FormInlineProps } from "../types/playform"
import { Form } from "./components/general/Form"

export const FormInline = (props: FormInlineProps) => {
    return (
        <div 
            id="fbjs"
            className="fb-formbricks-form"
            style={{
                height: "100%",
                width: "100%"
            }}>
                <Form 
                    {...props}
                />
        </div>
    )
}