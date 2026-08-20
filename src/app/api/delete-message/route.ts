import { db } from "@/firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    console.log("delete message route is running");
    const msgId = searchParams.get("msgId");

    if (!msgId) {
      return NextResponse.json({ error: "msgId is required" }, { status: 400 });
    }

    const messageRef = doc(db, "messages", msgId);

    try {
      await deleteDoc(messageRef);
      console.log("Message successfully deleted!");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
    return NextResponse.json("Message Deleted Successfully");
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
