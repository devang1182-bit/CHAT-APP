import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    console.log("message route is running");
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 },
      );
    }

    const messagesRef = collection(db, "messages");

    const messagesQuery = query(
      messagesRef,
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc"),
    );

    const snapshot = await getDocs(messagesQuery);

    console.log(snapshot, " i am snapshot");

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(messages, "i am message service");
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
