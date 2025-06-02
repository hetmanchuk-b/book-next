import {checkPostTableExists} from "@/lib/db-utils";
import prisma from "@/lib/prisma";

export default async function Home() {
  const tableExists = await checkPostTableExists();

  if (!tableExists) {
    return <p>no posts</p>
  }

  // const posts = await prisma.post.findMany({
  //   orderBy: {
  //     createdAt: "desc"
  //   },
  //   take: 6,
  //   include: {
  //     author: {
  //       select: {name: true}
  //     }
  //   }
  // })

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <h1 className="text-5xl font-extrabold mb-12 text-[#333333]">Recent Posts</h1>
    </div>
  );
}
