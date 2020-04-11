import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "multiFilter",
})
export class FilterPipe implements PipeTransform {
  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    console.log(items)
    console.log(filter)
    return items.filter((item) => {
      const notMatchingField = Object.keys(filter).find(
        (key) => item[key] !== filter[key]
      );

      return !notMatchingField; // true if matches all fields
    });
  }
}
