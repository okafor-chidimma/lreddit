import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

//@objecttype decorator just converts this class to an object type
//@field decorator just converts the properties to fields and exposes it so that we can retrieve the field and its value in the graphql playground and the anonymous function passed in as a parameter is just to set the type of the field value to a string i.e it converts it to a string. you can set to int if you want
@ObjectType()
@Entity()
export class Post {
  @Field(() => Int) //type-graphql
  @PrimaryKey() //orm
  //a field can either be required or optional. when it is not initialized to is default value like how createdAt field was declared, then you have to specify if it is a required or optional field by using ! or ? respectively
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
/*
  @Property()
  body:string
*/
/*
  @Property({ nullable: true })
    //since subject prop is optional, i have to also specify it in the @property decorator by setting nullable to true. without it, the ORM will create a migration file where subject is not null

    //@Property({ nullable: true }) maps to ORM which adds the null or not null to migration file and 
    subject?:string map to the class and it is seen when we want to create instances of the class, 

    both @Property() and field map to the db

    if we want to add this field to graphql schema, we need to us the @field decorator

  subject?:string
*/
}
