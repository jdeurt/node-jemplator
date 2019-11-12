# Jemplator
Read and fill template files.

### Instalation

```shell
$ npm i jemplator
```

### Examples

#### Filling a template file

##### Template file

```
A simple sentence:
Hello my name is {{ user.name }} and I am a(n) {{ user.age }} year-old {{ user.gender }}!

Inline sandboxed Javascript execution:
{{>> js {{ numbers }}.join(", ") }}

Yes, {{ numbers }} gets stringified.
```

##### Javascript

```javascript
const Jemplator = require("jemplator");

// Update the output file manually like this or you can pass true as the last
// parameter to have it automatically update every time it's filled.
const template = new Jemplator("./input.template", "./output.txt");

template.fill({
  user: {
    name: "Juan de Urtubey",
    age: 18,
    gender: "male"
  },
  numbers: [1, 2, 3]
});

template.update();
```

##### Output

```
A simple sentence:
Hello my name is Juan de Urtubey and I am a(n) 18 year-old male!

Inline sandboxed Javascript execution:
1, 2, 3

Yes, [1,2,3] gets stringified.
```

#### Filling a template string

```javascript
const Jemplator = require("jemplator");

const templateString = "{{ greeting }} {{ user.name }}{{>> js '!' }}";

console.log(Jemplator.fillStr(templateString, {
  greeting: "Hello",
  user: {
    name: "Bob"
  }
}));

// "Hello Bob!"
```

### License

This project is licensed under the MIT License
