# Scope and Time

While experimenting with event loops, I noticed something odd. When I used a variable as a closure, the timing of a while loop using that variable doubled. What was odd was that the while loop was not in the function generating the closure. So I began to investigate. 

The goal is to count to 10 million. Not all browsers could handle all the methods I investigated. Ten million seems to be where the timing gets noticeable for Chrome and some others on my machine. The investigation only matters if doing something large in size. 

My [first batch of tests used while loops][test1]. My [second batch of tests used for loops][test2]. 

[test1]: http://jsfiddle.net/programmingmath/rFKnr/
[test2]: http://jsfiddle.net/programmingmath/NknG6/

To summarize my findings:

1. Localizing an object is mostly performance savvy. A variable being used as a closure should not be repeatedly accessed even in its own local scope. Treat a closure as a tunnel between scopes; use the local roads to get around, not the sewers.

2. Browsers do have significant differences in performance and relative speeds. Closures seem greatly penalized in Firefox. Chrome is okay with closures.

3. Use `for` loops for arrays. Do not use `forEach` or `for..in`. 

4. Localize the array length property.

5. Avoid creating large arrays.

While these concerns only really apply for large data sets, it strikes me as good practice to minimize possible techniques. So I would argue that the most performant technique, unless brutal to use, should be used. And the techniques here have the benefit of clarity as well as performance. 

Note these tests obviously vary from run to run, but they did not seem to have significant differences. It is the relative timing that matters, not the absolute.

## While loops

The following tests were done on a MacAir vintage Jul 2011. See below for a description of the different tests. 

<table>
  <thead>
    <tr> <th> Test</th>   <th>node 0.6.5 </th>            <th>Chrome 16</th><th>Firefox 9</th><th>Safari 5</th></tr>
  </thead>
  <tody>
    <tr><td> 1. Local                               </td>   <td> 17ms </td>    <td> 17ms</td>        <td>  9ms </td>     <td> 32ms</td></tr>            
    <tr><td> 2. Closure                             </td>   <td> 35ms </td>    <td> 40ms</td>        <td> 65ms </td>     <td> 56ms</td></tr>
    <tr><td> 3. Unused Closure                      </td>   <td> 35ms </td>    <td> 36ms</td>        <td> 35ms </td>     <td> 33ms</td></tr>
    <tr><td> 4. Unused Read-only Closure            </td>   <td> 19ms </td>    <td> 18ms</td>        <td> 20ms </td>     <td> 61ms</td></tr>
    <tr><td> 5. Localizing Closure                  </td>   <td> 14ms </td>    <td> 15ms</td>        <td> 20ms </td>     <td> 36ms</td></tr>
    <tr><td> 6. Object                              </td>   <td> 35ms </td>    <td> 36ms</td>        <td> 39ms </td>     <td> 59ms</td></tr>
    <tr><td> 7. Object Read-only                    </td>   <td> 19ms </td>    <td> 20ms</td>        <td> 20ms </td>     <td> 61ms</td></tr>
    <tr><td> 8. Localizing Object                   </td>   <td> 15ms </td>    <td> 15ms</td>        <td> 25ms </td>     <td> 31ms</td></tr>
    <tr><td> 9. Same as 1                           </td>   <td> 14ms </td>    <td> 15ms</td>        <td>  9ms </td>     <td> 31ms</td></tr>
    <tr><td>10. Closure Localizing Comparison       </td>   <td> 34ms </td>    <td> 35ms</td>        <td> 67ms </td>     <td> 52ms</td></tr>
    <tr><td>11. Closure Localizing Comparison/Adding</td>   <td> 17ms </td>    <td> 27ms</td>        <td> 26ms </td>     <td> 39ms</td></tr>    
  </tbody>                                                                           
</table>

As you can see, closures tank performance. In both Chrome and Safari, it seems that it is equivalent to an object being accessed. In Firefox, closure performance is much worse than object access. Notice that in both Firefox and Chrome, a variable being a closure affects the performance even though the variable is being used locally outside of the function. Safari is not bothered by that, but it is bothered by having an additional term to add.


The tests, courtesy of SG, below were done on a windows machine (Windows XP Professional, Service Pack 3, Pentium(R) 4 CPU, 3.20 GHz, 3.19GHz, 2.00 GB of RAM). Note that IE7 choked on counting to 10 million and even a little on 1 million. So its results are for a hundred thousand. The iPad 1 (iOS 5) choked on 10 million, but it was okay for 1 million. The important part for this post are the relative times. I look forward to checking out IE9 soon.

<table>
  <thead>
    <tr> <th> Test</th>   <th>Firefox 9 (1e7) </th>            <th>Chrome 16 (1e7)</th><th>IE 7 (!!1e5)</th><th>iPad 1 (!1e6)</th></tr>
  </thead>
  <tody>
    <tr><td> 1. Local                   </td>   <td>  41ms</td>    <td>  23ms</td>        <td> 15ms </td>     <td> 17ms</td></tr>            
    <tr><td> 2. Closure                 </td>   <td> 130ms</td>    <td>  40ms</td>        <td> 47ms </td>     <td> 68ms</td></tr>
    <tr><td> 3. Unused Closure          </td>   <td>  41ms</td>    <td>  32ms</td>        <td> 16ms </td>     <td> 15ms</td></tr>
    <tr><td> 4. Unused Read-only Closure</td>   <td>  44ms</td>    <td>  25ms</td>        <td> 15ms </td>     <td> 35ms</td></tr>
    <tr><td> 6. Object                  </td>   <td>  77ms</td>    <td>  52ms</td>        <td> 62ms </td>     <td> 65ms</td></tr>
    <tr><td> 7. Object Read-only        </td>   <td>  53ms</td>    <td>  30ms</td>        <td> 16ms </td>     <td> 41ms</td></tr>
    <tr><td> 8. Localizing Object       </td>   <td>  51ms</td>    <td>  22ms</td>        <td> 31ms </td>     <td> 29ms</td></tr>
    <tr><td> 9. Same as 1               </td>   <td>  41ms</td>    <td>  22ms</td>        <td> 16ms </td>     <td> 16ms</td></tr>
  </tbody>                                                                           
</table>

Notice again that Firefox really gets it with the use of closures. For Chrome, object access seems worse than closures. Over in IE land, objects are also worse off than closures. Notice that localizing in IE still took a hit in performance. Finally, the iPad 1, shows similar behavior to Safari (no kidding!), though it is counting only 10% of what the desktop did for comparable times.

Note Chrome (Win and Mac) and node are essentially the same. Safari and iPad are similar in relative. Firefox relative strength is same on both Win and Mac.

1. The variable is locally scoped. The full code is given only for this one. For the other ones, only the relevant changes are shown. See the fiddles above for the full listing or on [my GitHub page][github]

    ```javascript
    /*globals console*/

    var times = 1e7; 

    (function (times) {
      var count = 0;
      var start = (new Date()).getTime();  
      while (count < times) {
        count += 1;
      }
      console.log(( (new Date()).getTime() - start + "ms"), "immediate scope", count);
    }(times));
    ```
    
    We take a variable count and just increment it.
  
    Expectation: Fastest
    
    Reality: Fastest
  
    
2. The variable is scoped to the outer function.

        var count = 0;
        (function () {
          while (count < times) {
            count += 1;
          }
        }());
        
    Expectation: Slower, but not too much.
    
    Reality: 2x slow in Safari and Chrome, but 7x slower in Firefox. 3x slower in IE7.
        
        
3. The variable is a closure, but the loop uses it locally outside the function.

        var count = 0;
        while (count < times) {
          count += 1;
        }
        var ignore = function () {
          count += 1;
        };
      
      
    Expectation: As fast as 1. 
    
    Reality: Chrome same as 2 (mystifying!). Firefox halfway between 1 and 2. Safari and IE7 are the same as 1.
    
    
4. The count variable is locally scoped, but the loop reads a variable that is a closure.

        var count = 0;
        var none = 0;
        while (count < times) {
          count += 1 + none;
        }
        var ignore = function () {
          none += 1;
        };
        
    Expectation: As fast as 1.
        
    Reality: Chrome and IE7 same as 1. Firefox halfway between 1 and 3. Safari is 2x slower. This is not a closure problem, but just an addition problem for Safari. 
        
        
5. Locally scoping the closure

        var count = 0;
        (function () {
          var temp = count; 
          while (temp < times) {
            temp += 1;
          }
          count = temp;
        }());
        
    Expectation: Same as 1.
    
    Reality: Same as 1 in all but Firefox which is 2x slower. Untested in IE.    
        
        
6. Using an object. 

        var obj = {};
        obj.count = 0;
        while (obj.count < times) {
          obj.count += 1;
        }
        
    Expectation: Slower than 1 or 2.
    
    Reality: 2x slower in Chrome, Safari, comparable to 2. 4x slower in Firefox, IE7. Quicker than 2 for Firefox, slower than 2 for IE7. 
        
7. Using an object read-only

        var obj = {};
        var count = 0;
        obj.one = 1;
        while (count < times) {
          count += obj.one;
        }
         
    Expectation: Faster than 6, slower than 1.
    
    Reality: Comparable to 1 in Chrome and IE7. 2x slower in Firefox and Safari. Quicker than 6 for Firefox, comparable to 6 for Safari. 
        
8. Localizing the object

          var obj = {};
          obj.count = 0;
          (function () {
            var count = obj.count;
            while (count < times) {
              count += 1;
            }
            obj.count = count; 
          }());
          
      Expectation: As fast as 1.
      
      Reality: Same as 1 for Chrome and Safari. 3x slower in Firefox. 2x slower in IE7. It completely mystifies me.
          
9. The same as 1. Just put in there as the first time through it seems takes longer. 

    Expectation: Same as 1.
    
    Reality: A little faster for some testing ordering reason, presumably. 

10. Using a local variable for counting, but using a closure for incrementing.

        var count = 0;
        (function () {
          var temp = count; 
          while (temp < times) {
            temp += 1;
            count += 1;
          }
        }());
        
    Expectation: In between 1 and 2. 
    
    Reality: Comparable to 2 in Chrome, Safari, Firefox. Not tested in IE7. Apparently, the modification is the bottleneck. 

11. Using a local variable for counting and incrementing, but storing in closure each cycle.

        var count = 0;
        (function () {
          var temp = count; 
          while (temp < times) {
            temp += 1;
            count = temp;
          }
        }());
        
    Expectation: Comparable to 10.
    
    Reality: Comparable to 1 for node and nearly so for Safari. Halfway between 1 and 10 for Chrome. Nearer to 1 than 10 for Firefox. Not tested in IE.
        
        
## For loop

After a little thought, I began to wonder about for loops. There are so many ways to do for loops. Which one is faster? Here we are mainly using local scope except for the forEach uses.  


<table>
  <thead>
    <tr> <th> Test</th>   <th>node 0.6.5 </th>            <th>Chrome 16</th><th>Firefox 9</th><th>Safari 5</th></tr>
  </thead>
  <tody>
    <tr><td> 1. While         </td>   <td>  17ms </td>    <td>  16ms</td>        <td>    9ms </td>     <td>    32ms</td></tr>            
    <tr><td> 2. For           </td>   <td>  19ms </td>    <td>  36ms</td>        <td>   28ms </td>     <td>    32ms</td></tr>
    <tr><td> 3. For Empty     </td>   <td>  15ms </td>    <td>  18ms</td>        <td>   11ms </td>     <td>    32ms</td></tr>
    <tr><td> 4. Create Array  </td>   <td> 336ms </td>    <td> 398ms</td>        <td>  599ms </td>     <td>   502ms</td></tr>
    <tr><td> 5. For Length    </td>   <td>  60ms </td>    <td>  58ms</td>        <td>   72ms </td>     <td>    56ms</td></tr>
    <tr><td> 6. For Sum       </td>   <td>  85ms </td>    <td>  85ms</td>        <td>  102ms </td>     <td>    61ms</td></tr>
    <tr><td> 7. ForEachOut    </td>   <td> 199ms </td>    <td> 211ms</td>        <td> 1234ms </td>     <td>   329ms</td></tr>
    <tr><td> 8. ForEachMe     </td>   <td> 371ms </td>    <td> 430ms</td>        <td> 3157ms </td>     <td>   608ms</td></tr>
    <tr><td> 9. For In        </td>   <td>2165ms </td>    <td>2456ms</td>        <td>13852ms </td>     <td> 28533ms</td></tr>
  </tbody>                                                                           
</table>

As one can see, the `for in` construct is to be avoided at all costs for looping over large arrays. Even without performance issues, it is not sensible to use them for arrays as order need not be preserved and other properties may be included. The lovely `forEach` constructs are also fairly slow. Also note that creating an array is, understandably, a slow process. Accessing the length property of the array on each loop is also undesirable.

Now let's look at the windows machines. Note that as IE7 does not have forEach, the tests stopped there. Yes, I know, `for in` should come before. iPad 1 dies on even 1 million elements due to memory constraints, I presume.

<table>
  <thead>
    <tr> <th> Test</th>   <th>Firefox 9</th>            <th>Chrome 16</th><th> IE7 (!!1e5)</th><th>iPad 1 (!!1e5)</th></tr>
  </thead>
  <tody>
    <tr><td> 1. While         </td>   <td>   16ms </td>    <td>   19ms</td>        <td>  15ms </td>     <td>    2ms</td></tr>            
    <tr><td> 2. For           </td>   <td>   19ms </td>    <td>   31ms</td>        <td>  32ms </td>     <td>    2ms</td></tr>
    <tr><td> 3. For Empty     </td>   <td>   15ms </td>    <td>   18ms</td>        <td>   0ms </td>     <td>    1ms</td></tr>
    <tr><td> 4. Create Array  </td>   <td>  337ms </td>    <td>  565ms</td>        <td> 328ms </td>     <td>  25ms</td></tr>
    <tr><td> 5. For Length    </td>   <td>   59ms </td>    <td>   69ms</td>        <td>  16ms </td>     <td>    5ms</td></tr>
    <tr><td> 6. For Sum       </td>   <td>   86ms </td>    <td>  129ms</td>        <td>  62ms </td>     <td>    9ms</td></tr>
    <tr><td> 7. ForEachOut    </td>   <td>  197ms </td>    <td>  324ms</td>        <td>  NA   </td>     <td>   29ms</td></tr>
    <tr><td> 8. ForEachMe     </td>   <td>  369ms </td>    <td>  615ms</td>        <td>  NA   </td>     <td>   60ms</td></tr>
    <tr><td> 9. For In        </td>   <td> 2206ms </td>    <td> 4233ms</td>        <td>  NA   </td>     <td>  490ms</td></tr>
  </tbody>                                                                           
</table>


According to [John Resig's benchmark analysis][ejohn], IE7 measures in 15ms intervals. So the 0ms is just a resolution error. This is also important in understanding that the times may not be that accurate for IE.

1. A plain while loop.

        var count = 0;
        while (count < times) {
          count += 1;
        }

    Expectation: Fastest.
    
    Reality; Fastest.

2. A simple for loop with count incrementing in the body of the loop.

        var count = 0;
        var i;
        for (i = 0; i < times; i += 1) {
          count += 1;
        }

    Expectation: Slower than 1, but still fast. It is doing extra work.
    
    Reality: node, Safari, and Firefox Win were as fast as 1. 2x as slow as 1 for Chrome. Firefox Mac came in at 3x as slow.


3. A for loop with no body. The counter is the loop counter.

        var count = 0;
        var i;
        for (i = 0; i < times; i += 1) {
          ;
        }

    Expectation: As fast as 1.
    
    Reality: As fast as 1. 

4. Creating an array of all the 1's to be summed.

        var count = 0;
        var i;
        var a = [];
        for (i = 0; i < times; i += 1) {
          a.push(1);
        }
        
    Expectation: Slow as molasses.
    
    Reality: 20x+ as slow as for loop.


5. Using the length of the generated array as the upper maximum. 

        for (i = 0; i < a.length; i += 1) {
          ;
        }

    Expectation: As slow as object access.
    
    Reality: 3x or so as slow as 1. Firefox was 8x on Mac.


6. Summing all the 1's in the array. 

        for (i = 0; i < times; i += 1) {
          count += a[i];
        }
        
    Expectation: Slow.
    
    Reality: Roughly 4x or 5x as slow on Chrome, Firefox, IE. But Safari was only 2x as slow. 

7. Using forEach with a closure

        var countA = 0;
        var self = function () {
          countA += 1;
        };
        a.forEach(self);
       
    Expectation: Slow like closures above.
    
    Reality: 10x as slow as 1. Firefox Mac 100x as slow. Not available in IE 7. 

8. Using the callback function for forEach to store the count variable. 

        var selfB = function selfB () {
          selfB.count += 1;
        };
        selfB.count = 0;
        a.forEach(selfB);
        
    Expectation: Faster than 7, but still slow.
    
    Reality: 20x as slow as 1. Firefox brutally slow--300x as slow. 

9. Using a for in loop. Not shown here is one with just added one. There is a minor time savings, roughly the size of the for sum difference.

        count = 0;
        for (i in a) {
          count += a[i];
        }
        
    Expectation: A little slower.
    
    Reality: 120x or so as slow in Chrome. Off the charts slow in Safari, Firefox. Did not test in IE.

<!-- -->

[github]: https://github.com/jostylr/posts/tree/master/mythiclogos.com/code/scopetime 
[ejohn]: http://ejohn.org/blog/javascript-benchmark-quality/