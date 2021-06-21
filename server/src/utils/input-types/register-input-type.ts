import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInputType {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

/*
    HOW TO CREATE AN INPUT TYPE FOR A GRAPHQL IN TS

    1. create a TS class
    2. use the the @input type decorator on it. you can decide to change the name of the input type by using the name parameter other wise, type-graphql uses the class name as the input name
    3. declare normal class properties with the ? or ! and the types where appropriate
    4. decorate all the properties you want to map to graphql with the @field decorator
    5. check the user.ts in the resolvers folder on how to use it

    KEY POINTS
    1. Object types you can return from a mutation or query but input types you use as arguments
    2. both object types and input types can be formed from a class by using the right decorators
    3. once you make a property optional and you want to map said property to a graphql type, the you need to pass in the nullable property to the field decorator of the said property. check User Response object type in utils/custom-types/user-response-type.ts 

*/
