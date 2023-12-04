import dbConnect from "@/db/connect";
import Review from "@/db/models/Review";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  // GET method
  if (request.method === "GET") {
    const review = await Review.findById(id);

    if (!review) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(review);
  }
}
