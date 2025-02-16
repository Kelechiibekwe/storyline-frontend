export function Footer() {
  return (
    <footer className="border-t py-4 w-full bg-background/50 backdrop-blur-sm">
      <div className="container text-center text-sm text-muted-foreground">
        <div className="py-4">
          <div className="leading-loose">
            Built by{" "}
            <a
              href="https://ehtisham.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Ehtisham Afzal
            </a>{" "}
          </div>
        </div>
      </div>
    </footer>
  )
}

