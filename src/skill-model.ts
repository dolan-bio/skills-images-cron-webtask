import * as mongoose from "mongoose";

interface ISkillDocument extends mongoose.Document {
    name: string;
    image: string;
}

const SkillSchema = new mongoose.Schema({
    name: String,
    image: String,
});

const Skill = mongoose.model<ISkillDocument>("Skill", SkillSchema);

export { Skill, ISkillDocument };
