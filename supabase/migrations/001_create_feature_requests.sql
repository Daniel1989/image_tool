-- Create the feature_requests table
CREATE TABLE IF NOT EXISTS feature_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    votes INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);

-- Create an index on is_hidden for faster filtering
CREATE INDEX IF NOT EXISTS idx_feature_requests_is_hidden ON feature_requests(is_hidden);

-- Create an index on votes for sorting
CREATE INDEX IF NOT EXISTS idx_feature_requests_votes ON feature_requests(votes DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_requests_updated_at 
    BEFORE UPDATE ON feature_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (non-hidden items)
CREATE POLICY "Allow public read access for non-hidden feature requests" 
    ON feature_requests FOR SELECT 
    USING (is_hidden = FALSE);

-- Create policy for public insert
CREATE POLICY "Allow public insert of feature requests" 
    ON feature_requests FOR INSERT 
    WITH CHECK (true);

-- Create policy for public vote updates (only votes column)
CREATE POLICY "Allow public vote updates" 
    ON feature_requests FOR UPDATE 
    USING (true) 
    WITH CHECK (true); 