import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 25,
      required: true,
    },

    lastName: {
      type: String,
      minLength: 2,
      maxLength: 25,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.SYSTEM;
      },
    },

    confirmPassword: String,

    phone: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.SYSTEM;
      },
    },

    DOB: Date,

    confirmEmail: Date,

    image: String,

    coverImage: [String],

    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      default: RoleEnum.USER,
      enum: Object.values(RoleEnum),
    },
    provider: {
      type: Number,
      default: ProviderEnum.SYSTEM,
      enum: Object.values(ProviderEnum),
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
  },
);

userSchema
  .virtual("userName")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
