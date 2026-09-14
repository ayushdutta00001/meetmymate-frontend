export function mapP2PProfile(data: any) {
  console.log("RAW INTERESTS FROM DB:", data.interests);

  const mapped = {
    name: data?.users?.name ?? "User",
    avatar: data?.users?.profile_photo_url ?? "",
    role: data?.headline ?? "",
    location: data?.users?.city ?? "",
    about: data?.bio ?? "",

    verified: true,
    availability: "in-person",

    profession: data?.headline ?? "",

    // 🔥 THIS IS THE CRITICAL FIX
    seeking: {
      title: "Who I Want to Find",
      description: "",
      skills: Array.isArray(data?.interests)
        ? [...data.interests]
        : [],
    },

    experience: Array.isArray(data?.experience)
      ? [...data.experience]
      : [],

    education: data?.education ?? "Not specified",

    skills: Array.isArray(data?.skills)
      ? [...data.skills]
      : [],
  };

  console.log("FINAL SEEKING SKILLS:", mapped.seeking.skills);

  return mapped;
}