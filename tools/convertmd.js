var myArgs = process.argv.slice(2).join(' ').split(/\s+/);

  switch (myArgs[0]) {
    case '':
      console.log("Nothing to convert");
      break;
    default:
      console.log(convert(myArgs[0]));
  }

  //should put this in an entry field in the browser page version...
  var myFiles = "/projectname/"

function convert(filename) {

  const fs = require('fs');
  let contents = fs.readFileSync('./'+filename, 'utf-8')

  let title = filename.split("/")[filename.split("/").length-1].split(".").slice(0,-1).join("!")

  //read in list of characters to display on the right
  //note: I want to make it so that you can also make it appear in the right just once with a special character...
  
  var right = []
  
  if (contents.slice(0,7) == "//RIGHT") {
    right = contents.substring(8, contents.indexOf('\n')).split(' ');
    contents = contents.substring(contents.indexOf('\n'), contents.length)
  } 
  //remove comments

  const comment = /\/\/.*\n/g

  contents = contents.replace(comment, "")

  //add speech shortcode (note: default to left portrait)
  //expr says person:<any # spaces>dialogue<at least 1 newline>
  //pad 1 trailing newline in case we have to match last line

  const speech = /([^:^\n^ ]*): *([^:^`^@]*)[\n ]+/g

  const sc_speech = '\n{{< speech "/ugeu0/icon/$1.png" "$1" >}}$2{{< /speech >}}\n'

  contents = contents.concat("\n").replace(speech, sc_speech)

  //add right argument to the ones in the right list
  
  for(let name of right) {

    const rs = new RegExp('("' + name + '.*")')

    contents = contents.replace(new RegExp(rs.source, "g"), '$1 "right"')
  }

  //change underscore to space in the alt text
  //use the replacement twice to catch speech icons with up to 3 words in the name - quick and dirty. Could repeat until fixpoint for unlimited length.

  const alttxt = /_([^"]*" >)/g

  contents = contents.replace(alttxt, ' $1')
  contents = contents.replace(alttxt, ' $1')

//I don't want to talk about it

  const alttxt2 = /_([^"]*" "right" >)/g

  contents = contents.replace(alttxt2, ' $1')
  contents = contents.replace(alttxt2, ' $1')

  //wrap blocks of speech in dialogue shortcode

  const dialogue = /(\{\{< speech ".*" ".*" >\}\}[^`^@]*\{\{< \/speech >\}\})/g

  const sc_dialogue = '{{< dialogue >}}$1{{< /dialogue >}}'

  contents = contents.replace(dialogue, sc_dialogue)

  //strip dialogue's leading whitespace
  
  const leading_dialogue = /[\n ]*\{\{< dialogue >\}\}/g

  contents = contents.replace(leading_dialogue, "\n{{< dialogue >}}")

  //strip trailing/leading whitespace inside narration

  const leadtrail = /```[\n ]*([^\n^ ][^`]*[^\n^ ])[\n ]*```/g

  contents = contents.replace(leadtrail, "```$1```")

  //add narration shortcode

  const narration = /```([^`^@]*)```/g

  contents = contents.replace(narration, "{{<narration>}}$1{{</narration>}}")

  //add panel placeholders

  const image = /@([^ ^\n]*)/g

  const md_image = "![$1](/ugeu0/panel/$1.png)"

  contents = contents.replace(image, md_image)

  //replace underscore with space in the panel alt text

  //tbd

  //add nopanel box if narration is first.. or something

  //add typical hugo header

  const firstPng = contents.match('/[^.]*\.png')[0].substring(1)

  const timestamp= new Date().toISOString();

  const hugoheader = 
  '---\n\
title: ' + title + '\n\
date: ' + timestamp + '\n\
draft: false\n\
description: ""\n\
firstImage: "' + firstPng + '"\n\
---\n'

  contents = hugoheader.concat(contents)

  return contents;
}


