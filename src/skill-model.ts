import * as mongoose from "mongoose";

interface ISkillDocument extends mongoose.Document {
    name: string;
}

const SkillSchema = new mongoose.Schema({
    name: String,
});

const Skill = mongoose.model<ISkillDocument>("Skill", SkillSchema);

export { Skill, ISkillDocument };
