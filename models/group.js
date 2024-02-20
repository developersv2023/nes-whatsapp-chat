import mongoose from "mongoose";

const GroupSchema = mongoose.Schema({
  name: String,
  image: String,
  //creador del grupo
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //participantes del grupo
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Group = mongoose.model("Group", GroupSchema);
