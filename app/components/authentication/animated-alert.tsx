import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircleIcon, CheckCircle2Icon} from "lucide-react";
import React from "react";

interface AlertProps {
    success?: boolean
    message: string
    animateOut: boolean
}

export default function AnimatedAlert({success, message, animateOut}: AlertProps) {
    return (
        <div
            className={`fixed z-50 w-full max-w-xs alertPosition ${animateOut ? 'alertSlideUp' : 'alertSlideDown'}`}>
            {success ? (
                <Alert variant="default">
                    <CheckCircle2Icon/>
                    <AlertTitle>{message}</AlertTitle> đoạn này k hiển thị
                    <AlertDescription>{message}</AlertDescription>đoạn này k hiển thị
                </Alert>
            ) : (
                <Alert variant="default">
                    <AlertCircleIcon className="h-5 w-5"/>
                    <AlertTitle>{message}</AlertTitle>
                </Alert>
            )}
        </div>

    )
}