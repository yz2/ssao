while true
do
    kramdown $1.md > $1.html
    sleep 3
    rm $1.html && touch $1.html
done