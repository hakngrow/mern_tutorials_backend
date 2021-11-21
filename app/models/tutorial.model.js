module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean
    },
    { timestamps: true }
  );

  // Override toJSON function
  schema.method("toJSON", function() {
    // Deconstruct into custom object that excludes auto-generated fields __v and _id
    const { __v, _id, ...object } = this.toObject();

    // Create new id field with value of primary key _id 
    object.id = _id;

    return object;
  });

  const Tutorial = mongoose.model("tutorial", schema);
  
  return Tutorial;
};