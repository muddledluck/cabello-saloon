import TagsModel, { TagsDocument } from "../../model/v1/tags.mode";
import slugify from "../../utils/slug";

export async function createTags(
  input: string[]
): Promise<TagsDocument["_id"][]> {
  try {
    const tags: TagsDocument["_id"][] = [];
    for (const tag of input) {
      const slug = slugify(tag);
      let tagExists = await TagsModel.findOne({ slug });
      if (!tagExists) {
        tagExists = await TagsModel.create({ name: tag, slug });
      }
      tags.push(tagExists._id);
    }
    return tags;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllTags(): Promise<TagsDocument[]> {
  try {
    const tags = await TagsModel.find();
    return tags;
  } catch (error: any) {
    throw new Error(error);
  }
}