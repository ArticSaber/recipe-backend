import recipeModel from "../models/recipe.js";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import path from "path";

const getAllRecipes = async (req, res) => {
  const listItems = await recipeModel.find();
  res.status(200).json(listItems);
};

const getARecipe = async (req, res) => {
  const recipe = await recipeModel.findById(req.params.id);
  res.status(200).json(recipe);
};

const addRecipe = async (req, res) => {
  const { title, ingredients, steps } = req.body;
  const newSteps = JSON.parse(steps);
  const { destination, filename } = req.file;
  const filePath = process.cwd() + "tmp/" + filename;
  console.log(filePath);
  try {
    const { secure_url } = await cloudinary.uploader.upload(destination+'/'+filename, {
      public_id: randomUUID(),
      folder: "recipe",
    });
    console.log(secure_url);
    const recipe = await recipeModel.create({
      title,
      ingredients,
      steps: newSteps,
      image: secure_url,
    });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  const { title, ingredients, steps } = req.body;
  const newSteps = JSON.parse(steps);

 const { destination, filename } = req.file;
  try {
     const { secure_url } = await cloudinary.uploader.upload(
      destination + "/" + filename,
      {
        public_id: randomUUID(),
        folder: "recipe",
      }
    );
    const recipe = await recipeModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        ingredients,
        steps: newSteps,
      image: secure_url,

      },
      { new: true }
    );
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const deleteList = await recipeModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `deleted the list` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllRecipes, addRecipe, updateRecipe, getARecipe, deleteRecipe };
