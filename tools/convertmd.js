var myArgs = process.argv.slice(2).join(' ').split(/\s+/);

  switch (myArgs[0]) {
    case '':
      console.log("Nothing to convert");
      break;
    default:
      console.log(convert(myArgs[0]));
  }

  var myFiles = "/projectname/"

function convert(filename) {

  const fs = require('fs');
  let contents = fs.readFileSync('./'+filename, 'utf-8')

  //remove comments

  const comment = /\/\/.*\n/g

  contents = contents.replace(comment, "")

  //add speech shortcode (note: default to left portrait)
  //expr says person:<any # spaces>dialogue<at least 1 newline>
  //pad 1 trailing newline in case we have to match last line

  const speech = /([^:^\n^ ]*): *([^:^`^@]*)[\n ]+/g

  const sc_speech = '\n{{< speech "/sweu/icon/$1.png" "$1" >}}$2{{< /speech >}}\n'

  contents = contents.concat("\n").replace(speech, sc_speech)

  //change underscore to space in the alt text
  //use the replacement twice to catch speech icons with up to 3 words in the name - quick and dirty. Could repeat until fixpoint for unlimited length.

  const alttxt = /_([^"]*" >)/g

  contents = contents.replace(alttxt, ' $1')
  contents = contents.replace(alttxt, ' $1')

  //wrap blocks of speech in dialogue shortcode

  const dialogue = /(\{\{< speech ".*" ".*" >\}\}[^`^@]*\{\{< \/speech >\}\})/g

  const sc_dialogue = '{{< dialogue >}}$1{{< /dialogue >}}'

  contents = contents.replace(dialogue, sc_dialogue)

  //strip trailing/leading whitespace inside narration

  const leadtrail = /```[\n ]*([^\n^ ][^`]*[^\n^ ])[\n ]*```/g

  contents = contents.replace(leadtrail, "```$1```")

  //add narration shortcode

  const narration = /```([^`]*)```/g

  contents = contents.replace(narration, "{{<narration>}}$1{{</narration>}}")

  //add panel placeholders

  const image = /@([^ ^\n]*)/g

  const md_image = "![$1](/sweu/panel/$1.png)"

  contents = contents.replace(image, md_image)

  //replace underscore with space in the panel alt text

  //tbd

  return contents;
}


