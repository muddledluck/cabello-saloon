import slug from "slug";

function slugify(str: string) {
  return slug(str, { lower: true });
}

export default slugify;
