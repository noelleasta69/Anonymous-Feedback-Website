import * as React from 'react';
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps): JSX.Element {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Email Verification</title>
      </Head>

      {/* console.log(username, otp); */}
      
      {/* Preview text that shows in the user's inbox */}
      <Preview>Your verification code is {otp}</Preview>

      {/* <Font href="https://fonts.googleapis.com/css?family=Arial" /> Optional: Add custom font */}

      <Section style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Heading as="h1">Email Verification</Heading>

        <Text>Hello {username},</Text>

        <Text>
          Please use the following code to verify your email address:
        </Text>

        <Row>
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              padding: "10px 0",
              color: "#333",
            }}
          >
            {otp}
          </Text>
        </Row>

        <Button
          href="#"
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Verify Email
        </Button>

        <Text>If you didn't request this code, please ignore this email.</Text>
      </Section>
    </Html>
  );
}
