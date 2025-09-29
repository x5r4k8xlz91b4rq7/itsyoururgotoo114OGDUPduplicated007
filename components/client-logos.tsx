const clients = [
  {
    name: 'TechCorp',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Innovation Labs',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'DataFlow',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Future Systems',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'AI Solutions',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200'
  }
]

const ClientLogos = () => {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {clients.map((client) => (
            <div
              key={client.name}
              className="w-24 h-24 md:w-32 md:h-32 bg-background rounded-lg shadow-sm flex items-center justify-center p-4"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-full object-contain opacity-50 hover:opacity-75 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClientLogos