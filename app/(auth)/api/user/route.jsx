import prisma from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, password } = body;
    console.log(email, name, password);
    // Validation for email, name, and password
    if (!email || !name || !password) {
      return NextResponse.json(
        {
          user: null,
          message: "All fields (email, name, password) are required.",
        },
        { status: 400 } // Bad Request
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          user: null,
          message: "Invalid email format.",
        },
        { status: 400 } // Bad Request
      );
    }

    // Name length validation
    if (name.length < 3) {
      return NextResponse.json(
        {
          user: null,
          message: "Name must be at least 3 characters long.",
        },
        { status: 400 } // Bad Request
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          user: null,
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 } // Bad Request
      );
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "User with this email already exists.",
        },
        { status: 409 } // Conflict
      );
    }

    // Hash the user's password
    const hashedPassword = await hash(password, 10);

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "User Created Successfully",
      },
      { status: 201 } // Created
    );
  } catch (err) {
    console.error("Error creating user:", err); // Log the actual error
    return NextResponse.json(
      {
        user: null,
        message: err.message || "An error occurred while creating the user.",
      },
      { status: 500 }
    );
  }
}
