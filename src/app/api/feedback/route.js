import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, message } = await request.json();

        if (!message || !message.trim()) {
            return NextResponse.json(
                { success: false, error: 'Feedback message is required.' },
                { status: 400 }
            );
        }

        if (message.length > 2000) {
            return NextResponse.json(
                { success: false, error: 'Feedback is too long.' },
                { status: 400 }
            );
        }

        const recipient = process.env.FORMSUBMIT_EMAIL;

        if (!recipient) {
            console.error('FORMSUBMIT_EMAIL is not configured.');
            return NextResponse.json(
                { success: false, error: 'Feedback service is not configured.' },
                { status: 500 }
            );
        }

        const formData = {
            _subject: 'Helbeku Feedback',
            _template: 'table',
            message: message.trim(),
        };

        if (email?.trim()) {
            formData.email = email.trim();
        }

        const response = await fetch(
            `https://formsubmit.co/ajax/${recipient}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            console.error('FormSubmit error:', await response.text());

            return NextResponse.json(
                { success: false, error: 'Unable to send feedback.' },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback API error:', error);

        return NextResponse.json(
            { success: false, error: 'Something went wrong.' },
            { status: 500 }
        );
    }
}