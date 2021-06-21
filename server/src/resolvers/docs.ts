/*
    CREATING GRAPHQL WITH TS
    using type-graphql package, it is very easy to define our schema both type definitions and operations definitions. this means that we can create schemas directly from TS classes

    1. create a resolver class. for e.g PostResolver 
        decorate it with @Resolver() from type-graphql to tel TS that it is a resolver
        declare and implement methods
            for each method you have defined, specify if it is a Query or Mutation resolver by using the appropriate resolver decorator

            also specify the return type for both the resolver decorator based on the graphql syntax and the resolver methods

    2. Schema definition for custom types
        using type-graphql package, we can convert TS classes to graphql custom types such as Post or User by converting the Post or User class to graphql types  using decorators
            use @objectType decorator on top of the class
            use @field decorator for the properties you want to add to the custom type. i.e for fields we want to retrieve from the client or graphql playground
            by default all fields are non nullable

            WHEN THE RESOLVER METHOD NEEDS TO TAKE IN ARGS OR USE CONTEXT OBJECT
            normal type defs for graphql ==>  updateUser(parent, args, ctx, info) where you have access to arguments passed via the args object and context via ctx object

            using type-graphql, you need to use @Args() and @Ctx() decorator
            e.g
            async updateUser(
                @Arg("titleQuery", { nullable: true }) title?: string,
                @Arg("servingsQuery") servings: number,

                @Ctx() ctx:MyContext
            ): Promise<Recipe[]> {
                // ...
            }

            this translates to updateUser mutation typeDefs showing the argument mapping
            updateUser(titleQuery:string,servingsQuery:Float!):[Recipe!]!

            for context, we use the @Ctx decorator, the variable "ctx" is available in the body of the updateUser resolver method and "ctx" is of type "MyContext"(this means that we need to create a custom type that is an object type since the context being passed from the apollo-server is an object and call MyContext which will list all the properties and data type of the expected value).

            const server = new GraphQLServer({
                typeDefs: "./src/schema.graphql",
                resolvers: {
                    Query
                },
                context: {
                    db: "this is my db",
                },
            });


            e.g type MyContext = {
                db:string;
            }


    TS CLASSES
    1. all properties declared are non nullable by default but if there is no constructor, TS will complain because the properties are not initialized and because they are not initialized, it means that these properties which by default are non nullable now have data type | null.
    for e.g
    class User{
        id:number; ==> even though we clearly state that id is of number data type. what that line tells TS is that id can be number or null. i.e id:number | null since we did not initialize it to a value and this violates the non nullable default rule, therefore, we must define a constructor function where we can initialize the id to a number value, there by clearly telling TS that id can only hold values of number type. another way to bypass this rule without using constructor is by 
           a. using ? or ! operator 
           b. or setting the type clearly to be number | null
           c. or setting id to be equal to a default value e.g id:number = 4
           if we are using way c, we can omit the type annotation as TS can infer from the value it has been assigned e.g id = 4
    } 

    in summary, since we can omit constructors, it means that there are 3 ideal ways to declare properties in a class
        optional ==> by using the ? syntax ==> here you can omit passing a value to this prop when instantiating the class. since there is no value assigned at the point of declaration, you must specify the data type of the value the property expects

        required ==> ! ==> this is used when we do not want to initialize the property to a default values but we want to ensure that the property has value every time the class is instantiated. since there is no value assigned at the point of declaration, you must specify the data type of the value the property expects

        initializing it to a value ==> this can be default value e.g age:number = 20 or a value passed to the constructor. if there is a value assigned at the point of declaration on the same line and not in the constructor, you can decide not to specify the data type of the value the property expects e.g age = 20, the compiler infers that age is of type number

    2. all the properties defined in a class represent fields in a db table if we are using ORM and class name maps to a table in the db if we are using ORM

    3. type-graphql now helps us to build out graphql schema from these classes defined that map to the db

    4. in defining a class, always use ? or ! operator when declaring properties if there is no constructor to initialize them or if we do not clearly assign a default value to it
*/
